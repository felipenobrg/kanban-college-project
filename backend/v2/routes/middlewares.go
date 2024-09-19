package routes

import (
	"context"
	"net/http"
	"strings"
	"time"

	"github.com/golang-jwt/jwt/v5"

	"tasker/models"
	"tasker/util"
)

const statusUnauthorized = http.StatusUnauthorized

func (app *Config) AuthenticatedOnly(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

		var tokenString string

		bearerToken := r.Header.Get("Authorization")
		if bearerToken != "" {
			bearer := strings.Split(bearerToken, " ")
			tokenString = bearer[1]
		}

		cookie, err := r.Cookie("session_token")
		if err != nil && tokenString == "" {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
			return
		} else if cookie != nil && tokenString == "" {
			tokenString = cookie.Value
		}

		token, err := util.ParseToken(tokenString)
		if err != nil {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if float64(time.Now().Unix()) > claims["exp"].(float64) {
				http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
				return
			}

			var user models.User
			app.Handlers.DB.First(&user, claims["sub"])
			if user.ID == 0 {
				http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), "user", user)

			next.ServeHTTP(w, r.WithContext(ctx))

		} else {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
		}
	})
}

func (app *Config) ResetPassWord(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		tokenString := r.URL.Query().Get("token")
		if tokenString == "" {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
			return
		}

		token, err := util.ParseToken(tokenString, "reset_password")
		if err != nil {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
			return
		}

		if claims, ok := token.Claims.(jwt.MapClaims); ok && token.Valid {
			if float64(time.Now().Unix()) > claims["exp"].(float64) {
				http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
				return
			}

			var user models.User
			app.Handlers.DB.First(&user, claims["sub"])
			if user.ID == 0 {
				http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
				return
			}

			ctx := context.WithValue(r.Context(), "user", user)

			next.ServeHTTP(w, r.WithContext(ctx))

		} else {
			http.Error(w, http.StatusText(statusUnauthorized), statusUnauthorized)
		}
	})
}

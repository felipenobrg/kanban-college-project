'use client'

import Link from 'next/link'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { z } from 'zod'
import { SubmitHandler } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import SigninAuth from '@/lib/auth/signin'
import { useRouter } from 'next/navigation'

export default function Register() {
  const schema = z.object({
    name: z
      .string()
      .min(2, { message: 'O nome deve ter no mínimo 2 caracteres' })
      .max(50, { message: 'O nome deve ter no máximo 50 caracteres' }),
    email: z
      .string()
      .email({ message: 'Por favor, informe um endereço de e-mail válido' }),
    password: z
      .string()
      .min(6, { message: 'A senha deve ter no mínimo 6 caracteres' }),
  })

  type FormFields = z.infer<typeof schema>

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormFields>({
    resolver: zodResolver(schema),
  })

  const router = useRouter()

  const onSubmit: SubmitHandler<FormFields> = async (data) => {
    try {
      await SigninAuth({
        email: data.email,
        password: data.password,
        name: data.name,
      })
      router.replace('/')
    } catch (error) {
      console.error('Error:', error)
    }
  }

  return (
    <div className="flex items-center flex-col justify-center h-screen">
      <Card className="mx-auto max-w-md p-6">
        <CardHeader>
          <CardTitle className="text-xl font-bold">Registre-se</CardTitle>
          <CardDescription className="text-gray-600">
            Informe suas informações para criar sua conta
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div className="grid gap-4">
              <div className="grid gap-2">
                <Label htmlFor="firstName">Nome</Label>
                <Input
                  id="firstName"
                  {...register('name')}
                  className="input"
                  placeholder="Max"
                  required
                />
                {errors.name && (
                  <span className="text-red-500">{errors.name.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  {...register('email')}
                  className="input"
                  placeholder="m@exemplo.com"
                  required
                />
                {errors.email && (
                  <span className="text-red-500">{errors.email.message}</span>
                )}
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Senha</Label>
                <Input
                  id="password"
                  type="password"
                  {...register('password')}
                  className="input"
                  required
                />
                {errors.password && (
                  <span className="text-red-500">
                    {errors.password.message}
                  </span>
                )}
              </div>
              <Button
                type="submit"
                className="btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Enviando...' : 'Criar sua conta'}
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Já tem uma conta?{' '}
            <Link href="/login" className="underline">
              Login
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

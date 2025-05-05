import { InvalidCredentialsError } from "@/use-cases/errors/invalid-credentials-error";
import { FastifyReply, FastifyRequest } from "fastify";

export async function refresh(request: FastifyRequest, reply: FastifyReply) {
  await request.jwtVerify({
    onlyCookie: true
  })

  try {
    const token = await reply.jwtSign({}, {
      sign: {
        sub: request.user.sub
      }
    })

    const refreshToken = await reply.jwtSign({}, {
      sign: {
        sub: request.user.sub,
        expiresIn: '7d'
      }
    })

    return reply
      .setCookie('refreshToken', refreshToken, {
        path: '/',
        secure: true,
        sameSite: true,
        httpOnly: true,
      })
      .status(200)
      .send({
        token,
      });
  } catch (err) {
    if (err instanceof InvalidCredentialsError) {
      return reply.status(400).send({ message: err.message })
    }

    throw err
  }

}

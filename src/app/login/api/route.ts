import jwtService from "../service/jwt";

export function GET(request: Request) {
  const token = jwtService.createToken({
    name: "Dongsun An",
  });

  return Response.json({
    token,
  });
}

type JWTError = {
  name: "TokenExpiredError";
  message:
    | "invalid token"
    | "jwt expired"
    | (string & {});
};

export async function POST(request: Request) {
  const { token } = await request.json();

  console.log(token);

  try {
    const isValid = jwtService.verifyToken(token);

    return Response.json({
      isValid,
    });
  } catch (error: unknown) {
    const { name, message } = error as JWTError;

    return Response.json({
      name,
      message,
    });
  }
}

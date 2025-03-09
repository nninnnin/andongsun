import jwt from "jsonwebtoken";

class JwtService {
  private service: JwtService | null = null;

  constructor() {
    if (this.service) {
      return this.service;
    } else {
      this.service = this;
    }

    return this.service;
  }

  createToken(payload: object): string {
    return jwt.sign(
      payload,
      process.env.JWT_SECRET_KEY ?? "",
      {
        expiresIn: "7d",
      }
    );
  }

  verifyToken(token: string): boolean {
    return jwt.verify(
      token,
      process.env.JWT_SECRET_KEY ?? ""
    )
      ? true
      : false;
  }
}

export default new JwtService();

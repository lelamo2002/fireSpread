import { PrismaUserRepository } from "../../infra/repositories/UserPrismaRepository";
import { GetUser } from "../GetUser";


export function MakeGetUser() {
  const userRepository = new PrismaUserRepository();
  return new GetUser(userRepository);
}
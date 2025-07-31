import { EntityManager } from '@mikro-orm/core';
import { User, UserRole } from '../entities/User.entity';
import { hashPassword, comparePassword } from '../utils/password.utils';
import { generateToken } from '../utils/jwt.utils';
import { LoginRequest, LoginResponse } from '../types';

export class AuthService {
  constructor(private em: EntityManager) {}

  async login(loginData: LoginRequest): Promise<LoginResponse> {
    const { email, password } = loginData;

    const user = await this.em.findOne(User, { email });
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new Error('Invalid credentials');
    }

    const token = generateToken(user);

    return {
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role,
      },
      token,
    };
  }

  async register(userData: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    role?: UserRole;
  }): Promise<User> {
    const existingUser = await this.em.findOne(User, { email: userData.email });
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await hashPassword(userData.password);

    const user = this.em.create(User, {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      role: userData.role || UserRole.USER,
      // Không cần createdAt, updatedAt vì entity tự set
    }as any);

    await this.em.persistAndFlush(user);
    return user;
  }
}
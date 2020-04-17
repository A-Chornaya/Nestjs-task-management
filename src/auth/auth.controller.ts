import { Controller, Post, Body, ValidationPipe, UseGuards, Req } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AuthService } from './auth.service';
import { AuthCredentialsDto } from './dto/auth-credentials.dto';
import { User } from './user.entity';
import { GetUser } from './get-user.decorator';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post('/signup')
    signUp(@Body(ValidationPipe) authCredentials: AuthCredentialsDto):  Promise<void> {
        return this.authService.signUp(authCredentials);
    }

    @Post('/signin')
    signIn(@Body(ValidationPipe) authCredentials: AuthCredentialsDto): Promise<{ accessTocken: string }>  {
        return this.authService.signIn(authCredentials);
    }

    @Post('/test')
    @UseGuards(AuthGuard())
    test(@GetUser() user: User){
        console.log(user);
    }
    // test(@Req() req) {
    //     console.log(req);
    // }

}

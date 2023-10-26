import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get('weather-info')
  getWeather(@Query('cityName') cityName: string) {
    try {
      if (cityName) {
        return this.appService.getWeatherInformationByCityName(cityName);
      } else {
        throw new HttpException({
          status: HttpStatus.BAD_REQUEST,
          error: 'Failed to fetch weather information of city. Please provide a valid city name.'
        }, HttpStatus.BAD_REQUEST);
      }
    } catch (error) {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to fetch weather information of city: ' + cityName
      }, HttpStatus.INTERNAL_SERVER_ERROR, { cause: error });
    }
  }
}

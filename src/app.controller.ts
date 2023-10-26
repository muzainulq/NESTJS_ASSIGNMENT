import { Controller, Get, HttpException, HttpStatus, Query } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  // search api - GET
  // https://www.weatherapi.com/weather/search.ashx?q=mumbai
  // [{"id":1125257,"name":"Mumbai","region":"Maharashtra","country":"India","lat":18.98,"lon":72.83,"url":"mumbai-maharashtra-india"}]
  // [{"id":1122691,"name":"Lucknow","region":"Uttar Pradesh","country":"India","lat":26.85,"lon":80.92,"url":"lucknow-uttar-pradesh-india"}]


  // https://www.weatherapi.com/weather/q/mumbai-maharashtra-india-1125257
  // https://www.weatherapi.com/weather/q/lucknow-uttar-pradesh-india-112269
  // 


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

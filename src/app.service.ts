import { HttpService } from '@nestjs/axios';
import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom, map } from 'rxjs';
import { City } from './city';

@Injectable()
export class AppService {
  private readonly logger = new Logger(AppService.name);
  private static readonly weatherApiUrl: string = 'https://www.weatherapi.com/weather/';

  constructor(private http: HttpService) { }

  async getWeatherInformationByCityName(cityName: string) {
    let cities = await this.searchCity(cityName);
    if (cities && cities.length > 0) {
      return await this.getWeatherByCityUrl(cities.at(0));
    } else {
      this.logger.error('Failed to fetch city details: ' + cityName);
      throw new HttpException({
        status: HttpStatus.NOT_FOUND,
        error: 'Failed to fetch city details: ' + cityName
      }, HttpStatus.NOT_FOUND);
    }
  }

  async getWeatherByCityUrl(city: City): Promise<any> {
    const url: string = this.getApiUrl('q/', city.url, '-', city.id);
    return this.http.get<any>(url).pipe(
      map((response) => { return response.data }),
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data);
        throw 'Failed to weather details for: ' + url;
      }),
    );
  }

  async searchCity(cityName: string): Promise<City[]> {
    return await firstValueFrom(this.http.get<City[]>(this.getApiUrl('search.ashx?q=', cityName)).pipe(
      map((response) => { return response.data }),
      catchError((error: AxiosError) => {
        this.logger.error(error.response.data);
        throw 'Failed to search city.';
      }),
    ),
    );
  }

  getApiUrl(...args: any[]) {
    let url: string = AppService.weatherApiUrl;
    if (args && args.length > 0) {
      args.forEach(val => {
        url = url.concat(val);
      });
    } else {
      throw new HttpException({
        status: HttpStatus.INTERNAL_SERVER_ERROR,
        error: 'Failed to get API url.'
      }, HttpStatus.INTERNAL_SERVER_ERROR);
    }
    this.logger.log("API URL: ", url);
    return url;
  }

}

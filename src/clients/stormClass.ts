/* eslint-disable @typescript-eslint/ban-types */
import { InternalError } from '@src/util/errors/internal-error';
import * as HTTPUtil from '@src/util/request';
import config, { IConfig } from 'config';

export interface IprevisaoTempoPointSource {
  [key: string]: number;
}
export interface IprevisaoTempoPoint {
  time: string;
  readonly waveHeight: IprevisaoTempoPointSource;
  readonly waveDirection: IprevisaoTempoPointSource;
  readonly swellDirection: IprevisaoTempoPointSource;
  readonly swellHeight: IprevisaoTempoPointSource;
  readonly swellPeriod: IprevisaoTempoPointSource;
  readonly windDirection: IprevisaoTempoPointSource;
  readonly windSpeed: IprevisaoTempoPointSource;
}
export interface IprevisaoTempoResponse {
  hours: IprevisaoTempoPoint[];
}
export interface IPontosPrevisao {
  time: string;
  waveHeight: number;
  waveDirection: number;
  swellDirection: number;
  swellHeight: number;
  swellPeriod: number;
  windDirection: number;
  windSpeed: number;
}

export class ClientRequestError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Erro inesperado ao tentar se comunicar com StormGlass';

    super(`${internalMessage}: ${message}`);
  }
}

export class StormGlassResponseError extends InternalError {
  constructor(message: string) {
    const internalMessage = 'Erro inesperado retornado pelo serviço StormGlass';

    super(`${internalMessage}: ${message}`);
  }
}

const previsaoTempoResourceConfig: IConfig = config.get('App.resources.StormGlass');

export class PrevisãoTempo {
  readonly params = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection,windSpeed';
  readonly source = 'noaa';

  constructor(protected request = new HTTPUtil.Request()) {}

  public async buscarPontos(lat: number, lng: number): Promise<IPontosPrevisao[]> {
    try {
      const response = await this.request.get<IprevisaoTempoResponse>(
        `${previsaoTempoResourceConfig.get('apiUrl')}/weather/point?lat=${lat}&lng=${lng}&params=${this.params}&source=${this.source}`,
        {
          headers: {
            Authorization: previsaoTempoResourceConfig.get('apiToken')
          }
        }
      );

      return this.normalizarResposta(response.data);
    } catch (err: any) {
      if (HTTPUtil.Request.isRequestError(err)) {
        throw new StormGlassResponseError(`Error: ${JSON.stringify(err.response.data)} Code: ${err.response.status}`);
      }
      throw new ClientRequestError(err.message);
    }
  }

  private normalizarResposta(points: IprevisaoTempoResponse): IPontosPrevisao[] {
    return points.hours.filter(this.isValidPoint.bind(this)).map((point) => ({
      swellDirection: point.swellDirection[this.source],
      swellHeight: point.swellHeight[this.source],
      swellPeriod: point.swellPeriod[this.source],
      time: point.time,
      waveDirection: point.waveDirection[this.source],
      waveHeight: point.waveHeight[this.source],
      windDirection: point.windDirection[this.source],
      windSpeed: point.windSpeed[this.source]
    }));
  }

  private isValidPoint(point: Partial<IprevisaoTempoPoint>): boolean {
    return !!(
      point.time &&
      point.swellDirection?.[this.source] &&
      point.swellHeight?.[this.source] &&
      point.swellPeriod?.[this.source] &&
      point.waveDirection?.[this.source] &&
      point.waveHeight?.[this.source] &&
      point.windDirection?.[this.source] &&
      point.windSpeed?.[this.source]
    );
  }
}

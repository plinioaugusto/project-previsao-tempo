/* eslint-disable @typescript-eslint/ban-types */
import axios, { AxiosStatic } from 'axios';

export interface IprevisaoTempoPointSource {
  [key: string]: number;
}
export interface IprevisaoTempoPoint {
  tempo: string;
  readonly alturaOnda: IprevisaoTempoPointSource;
  readonly direcaoOnda: IprevisaoTempoPointSource;
  readonly direcaoSwell: IprevisaoTempoPointSource;
  readonly alturaSwell: IprevisaoTempoPointSource;
  readonly periodoSwell: IprevisaoTempoPointSource;
  readonly direcaoVento: IprevisaoTempoPointSource;
  readonly velocidadeVento: IprevisaoTempoPointSource;
}
export interface IprevisaoTempoResponse {
  horas: IprevisaoTempoPoint[];
}
export interface IPontosPrevisao {
  tempo: string;
  alturaOnda: number;
  direcaoOnda: number;
  direcaoSwell: number;
  alturaSwell: number;
  periodoSwell: number;
  direcaoVento: number;
  velocidadeVento: number;
}

export class PrevisãoTempo {
  readonly previsaoAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection, windSpeed';
  readonly previsaoAPISource = 'noaa';

  constructor(protected request: AxiosStatic = axios) {}

  public async fetchPoints(lat: number, lng: number): Promise<IPontosPrevisao[]> {
    const response = await this.request.get<IprevisaoTempoResponse>(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.previsaoAPIParams}&source=${this.previsaoAPISource}`,
      {
        headers: {
          Authorization: 'fake-token'
        }
      }
    );
    return this.normalizarResposta(response.data);
  }

  private normalizarResposta(points: IprevisaoTempoResponse): IPontosPrevisao[] {
    return points.horas.filter(this.isValidPoint.bind(this)).map((point) => ({
      direcaoSwell: point.direcaoSwell[this.previsaoAPISource],
      alturaSwell: point.alturaSwell[this.previsaoAPISource],
      periodoSwell: point.periodoSwell[this.previsaoAPISource],
      tempo: point.tempo,
      direcaoOnda: point.direcaoOnda[this.previsaoAPISource],
      alturaOnda: point.alturaOnda[this.previsaoAPISource],
      direcaoVento: point.direcaoVento[this.previsaoAPISource],
      velocidadeVento: point.velocidadeVento[this.previsaoAPISource]
    }));
  }

  private isValidPoint(point: Partial<IprevisaoTempoPoint>) {
    return !!(
      point.tempo &&
      point.direcaoSwell?.[this.previsaoAPISource] &&
      point.alturaSwell?.[this.previsaoAPISource] &&
      point.periodoSwell?.[this.previsaoAPISource] &&
      point.direcaoOnda?.[this.previsaoAPISource] &&
      point.alturaOnda?.[this.previsaoAPISource] &&
      point.direcaoVento?.[this.previsaoAPISource] &&
      point.velocidadeVento?.[this.previsaoAPISource]
    );
  }
}

import { IPontosPrevisao, PrevisãoTempo } from '@src/clients/stormClass';

export enum IPosicaoPraia {
  S = 'S',
  E = 'E',
  W = 'W',
  N = 'N'
}

export interface IPraia {
  name: string;
  position: IPosicaoPraia;
  lat: number;
  lng: number;
  user: string;
}

export interface IPrevisaoPraia extends Omit<IPraia, 'user'>, IPontosPrevisao {}

export interface ITimePrevisao {
  time: string;
  forecast: IPrevisaoPraia[];
}

export class Previsao {
  constructor(protected stormGlass = new PrevisãoTempo()) {}

  public async processarPrevisaoByPraias(beaches: IPraia[]): Promise<ITimePrevisao[]> {
    const pontosFontesCorretas: IPrevisaoPraia[] = [];

    for (const beach of beaches) {
      const pontos = await this.stormGlass.buscarPontos(beach.lat, beach.lng);
      const dadosEnriquecidosPraia = pontos.map((e) => ({
        ...{},
        ...{
          lat: beach.lat,
          lng: beach.lng,
          name: beach.name,
          position: beach.position,
          rating: 1
        },
        ...e
      }));
      pontosFontesCorretas.push(...dadosEnriquecidosPraia);
    }

    return this.processarPrevisaoByTempo(pontosFontesCorretas);
  }

  private processarPrevisaoByTempo(forecast: IPrevisaoPraia[]): ITimePrevisao[] {
    const previsaoPorTempo: ITimePrevisao[] = [];

    for (const point of forecast) {
      const timePoint = previsaoPorTempo.find((f) => f.time === point.time);

      if (timePoint) {
        timePoint.forecast.push(point);
      } else {
        previsaoPorTempo.push({
          time: point.time,
          forecast: [point]
        });
      }
    }
    return previsaoPorTempo;
  }
}

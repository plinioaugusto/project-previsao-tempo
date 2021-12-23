import { AxiosStatic } from 'axios';

/* eslint-disable @typescript-eslint/ban-types */
export class PrevisãoTempo {
  readonly previsaoAPIParams = 'swellDirection,swellHeight,swellPeriod,waveDirection,waveHeight,windDirection, windSpeed';
  readonly previsaoAPISource = 'noaaa';

  constructor(protected request: AxiosStatic) {}

  public async fetchPoints(lat: number, lng: number): Promise<{}> {
    return this.request.get(
      `https://api.stormglass.io/v2/weather/point?lat=${lat}&lng=${lng}&params=${this.previsaoAPIParams}&source=${this.previsaoAPISource}`
    );
  }
}

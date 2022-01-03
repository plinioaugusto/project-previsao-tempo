import { PrevisãoTempo } from '@src/clients/stormClass';
import previsaoTempo_normalizado_3_horas from '@test/fixtures/previsaoTempo_normalizado_3_horas.json';
import { IPosicaoPraia, IPraia, Previsao } from '../forecast';

jest.mock('@src/clients/stormClass');

describe('Forecast Service', () => {
  it('deve retornar a previsão para uma lista de praias', async () => {
    PrevisãoTempo.prototype.buscarPontos = jest.fn().mockResolvedValue(previsaoTempo_normalizado_3_horas);

    const praias: IPraia[] = [
      {
        lat: -33.792726,
        lng: 151.289824,
        name: 'Manly',
        position: IPosicaoPraia.E,
        user: 'some-id'
      }
    ];
    const respostaEsperada = [
      {
        time: '2020-04-26T00:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 64.26,
            swellHeight: 0.15,
            swellPeriod: 3.89,
            time: '2020-04-26T00:00:00+00:00',
            waveDirection: 231.38,
            waveHeight: 0.47,
            windDirection: 299.45,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2020-04-26T01:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 123.41,
            swellHeight: 0.21,
            swellPeriod: 3.67,
            time: '2020-04-26T01:00:00+00:00',
            waveDirection: 232.12,
            waveHeight: 0.46,
            windDirection: 310.48,
            windSpeed: 100
          }
        ]
      },
      {
        time: '2020-04-26T02:00:00+00:00',
        forecast: [
          {
            lat: -33.792726,
            lng: 151.289824,
            name: 'Manly',
            position: 'E',
            rating: 1,
            swellDirection: 182.56,
            swellHeight: 0.28,
            swellPeriod: 3.44,
            time: '2020-04-26T02:00:00+00:00',
            waveDirection: 232.86,
            waveHeight: 0.46,
            windDirection: 321.5,
            windSpeed: 100
          }
        ]
      }
    ];
    const previsao = new Previsao(new PrevisãoTempo());

    const praiasClassificadas = await previsao.processarPrevisaoByPraias(praias);

    expect(praiasClassificadas).toEqual(respostaEsperada);
  });
});

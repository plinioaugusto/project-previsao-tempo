import { PrevisãoTempo } from '@src/clients/stormClass';
import axios from 'axios';
import previsaoTempo_3_horas from '@test/fixtures/previsaoTempo_3_horas.json';
import previsaoTempo_normalizado_3_horas from '@test/fixtures/previsaoTempo_normalizado_3_horas.json';
jest.mock('axios');

describe('StormGlass client', () => {
  const mockedAxios = axios as jest.Mocked<typeof axios>;

  it('deve retornar a previsão normalizada do serviço StormGlass', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedAxios.get.mockResolvedValue({ data: previsaoTempo_3_horas });

    const previsaoTempo = new PrevisãoTempo(mockedAxios);
    const response = await previsaoTempo.fetchPoints(lat, lng);
    expect(response).toEqual(previsaoTempo_normalizado_3_horas);
  });
});

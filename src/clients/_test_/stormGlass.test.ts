import { PrevisãoTempo } from '@src/clients/stormClass';
import axios from 'axios';
import previsaoTempo_3_horas from '@test/fixtures/previsaoTempo_3_horas.json';
import previsaoTempo_normalizado_3_horas from '@test/fixtures/previsaoTempo_normalizado_3_horas.json';
jest.mock('axios');

describe('StormGlass client', () => {
  it('deve retornar a previsão normalizada do serviço StormGlass', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    axios.get = jest.fn().mockResolvedValue(previsaoTempo_3_horas);

    const previsaoTempo = new PrevisãoTempo(axios);
    const response = await previsaoTempo.fetchPoints(lat, lng);
    expect(response).toEqual(previsaoTempo_normalizado_3_horas);
  });
});

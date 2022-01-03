import { PrevisãoTempo } from '@src/clients/stormClass';
import * as HTTPUtil from '@src/util/request';
import * as previsaoTempo_3_horas from '@test/fixtures/previsaoTempo_3_horas.json';
import previsaoTempo_normalizado_3_horas from '@test/fixtures/previsaoTempo_normalizado_3_horas.json';

jest.mock('@src/util/request');

describe('StormGlass client', () => {
  const MockedRequestClass = HTTPUtil.Request as jest.Mocked<typeof HTTPUtil.Request>;

  const mockedRequest = new HTTPUtil.Request() as jest.Mocked<HTTPUtil.Request>;

  it('deve retornar a previsão normalizada do serviço StormGlass', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockResolvedValue({ data: previsaoTempo_3_horas } as HTTPUtil.Response);

    const previsaoTempo = new PrevisãoTempo(mockedRequest);
    const response = await previsaoTempo.buscarPontos(lat, lng);
    expect(response).toEqual(previsaoTempo_normalizado_3_horas);
  });

  it('deve excluir pontos de dados incompletos', async () => {
    const lat = -33.792726;
    const lng = 151.289824;
    const incompleteResponse = {
      hours: [
        {
          windDirection: {
            noaa: 300
          },
          time: '2020-04-26T00:00:00+00:00'
        }
      ]
    };
    mockedRequest.get.mockResolvedValue({ data: incompleteResponse } as HTTPUtil.Response);

    const previsaoTempo = new PrevisãoTempo(mockedRequest);
    const response = await previsaoTempo.buscarPontos(lat, lng);

    expect(response).toEqual([]);
  });

  it('deve obter um erro genérico do serviço StormGlass quando a solicitação falha antes de chegar ao serviço', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    mockedRequest.get.mockRejectedValue({ message: 'Network Error' });

    const previsaoTempo = new PrevisãoTempo(mockedRequest);

    await expect(previsaoTempo.buscarPontos(lat, lng)).rejects.toThrow('Erro inesperado ao tentar se comunicar com StormGlass: Network Error');
  });

  it('deve obter um StormGlassResponseError quando o serviço StormGlass responder com erro', async () => {
    const lat = -33.792726;
    const lng = 151.289824;

    MockedRequestClass.isRequestError.mockReturnValue(true);

    mockedRequest.get.mockRejectedValue({
      response: {
        status: 429,
        data: { errors: ['Rate Limit reached'] }
      }
    });

    const previsaoTempo = new PrevisãoTempo(mockedRequest);

    await expect(previsaoTempo.buscarPontos(lat, lng)).rejects.toThrow(
      'Erro inesperado retornado pelo serviço StormGlass: Error: {"errors":["Rate Limit reached"]} Code: 429'
    );
  });
});

using Ituran.Modulo.Core.API.DTO.COTACOES;
using Ituran.Modulo.Core.API.DTO.PEDIDOS;
using Ituran.Modulo.Core.Dominio.Dto.Multicalculo.Pedido;
using System;
using System.Globalization;
using System.Linq;

namespace Ituran.Modulo.Core.API.Validacoes
{
    public class RFCMexico
    {
        public string PrimeiroNome { get; set; }

        public string SegundoNome { get; set; }

        public string TerceiroNome { get; set; }

        public string NascDia { get; set; }

        public string NascMes { get; set; }

        public string NascAno { get; set; }
    }

    public class ValidaRFCMexico
    {
        public string GerarRFC(COTACAO COTACAO, PEDIDO_DTO PEDIDO_CLIENTE = null)
        {
            var rfc = new RFCMexico();
            if (!string.IsNullOrEmpty(COTACAO.DS_RFC))
            {
                var DT_NASCIMENTO = Convert.ToDateTime(COTACAO.DS_PERFIL.FirstOrDefault(kv => kv.Key == $"nascimento_segurado").Value);
                rfc.PrimeiroNome = RemoveNomesComuns(RemovePrefixos(LimpaString(COTACAO.NM_PRIMEIRO_NOME.ToUpper())));
                rfc.SegundoNome = RemovePrefixos(LimpaString(COTACAO.NM_SOBRENOME_PAI.ToUpper()));
                rfc.TerceiroNome = string.IsNullOrEmpty(COTACAO.NM_SOBRENOME_MAE) ? "" : RemovePrefixos(LimpaString(COTACAO.NM_SOBRENOME_MAE.ToUpper()));
                rfc.NascDia = DT_NASCIMENTO.ToString("dd", CultureInfo.InvariantCulture);
                rfc.NascMes = DT_NASCIMENTO.ToString("MM", CultureInfo.InvariantCulture);
                rfc.NascAno = DT_NASCIMENTO.ToString("yy", CultureInfo.InvariantCulture);
            }
            else
            {
                rfc.PrimeiroNome = PEDIDO_CLIENTE.CLIENTE.NM_PRIMEIRO_NOME.ToUpper();
                rfc.SegundoNome = PEDIDO_CLIENTE.CLIENTE.NM_SOBRENOME_PAI.ToUpper();
                rfc.TerceiroNome = string.IsNullOrEmpty(PEDIDO_CLIENTE.CLIENTE.NM_SOBRENOME_MAE) ? "" : PEDIDO_CLIENTE.CLIENTE.NM_SOBRENOME_MAE.ToUpper();
                rfc.NascDia = PEDIDO_CLIENTE.CLIENTE.DT_NASCIMENTO.ToString("dd", CultureInfo.InvariantCulture);
                rfc.NascMes = PEDIDO_CLIENTE.CLIENTE.DT_NASCIMENTO.ToString("MM", CultureInfo.InvariantCulture);
                rfc.NascAno = PEDIDO_CLIENTE.CLIENTE.DT_NASCIMENTO.ToString("yy", CultureInfo.InvariantCulture);
            }
            return GerarParteComum(rfc);
        }

        private string LimpaString(string palavra)
        {
            string comAcentos = "ÄÅÁÂÀÃäáâàãÉÊËÈéêëèÍÎÏÌíîïìÖÓÔÒÕöóôòõÜÚÛüúûùÇç";
            string semAcentos = "AAAAAAaaaaaEEEEeeeeIIIIiiiiOOOOOoooooUUUuuuuCc";

            for (int i = 0; i < comAcentos.Length; i++)
            {
                palavra = palavra.Replace(comAcentos[i].ToString(), semAcentos[i].ToString());
            }
            return palavra;
        }

        private string RemovePrefixos(string nome)
        {
            string[] prefixos = new string[] {"PARA ", "AND ", "CON ", "DEL ", "LAS ",
                                              "LOS ", "MAC ", "POR ", "SUS ",
                                              "THE ", "VAN ", "VON ", "AL ",
                                              "DE ", "EL ","EN ", "LA ", "MC ",
                                              "MI ", "OF ", " A ", " E ", "Y ",
                                              "DE LOS ", "LOS "};

            foreach (var item in prefixos)
            {
                if (nome.Contains(item))
                {
                    nome = nome.Replace(item, string.Empty);
                }
            }
            return nome;
        }

        private string RemoveNomesComuns(string nome)
        {
            string[] naoNomes = new string[] { "MARIA DEL ", "MARIA DE LOS ", "MARIA ", " JOSE DE ", "JOSE ", "MA. ", "MA ", "M. ", "J. ", "J " };

            foreach (var item in naoNomes)
            {
                if (nome.Contains(item))
                {
                    nome = nome.Replace(item, string.Empty);
                }
            }
            return nome;
        }

        private string GerarParteComum(RFCMexico mexico)
        {
            var x = ObterLetrasRFC(mexico.PrimeiroNome, mexico.SegundoNome, mexico.TerceiroNome);
            x = RemovePalavrasNaoAceitas(x);
            x += mexico.NascAno;
            x += mexico.NascMes;
            x += mexico.NascDia;

            return x;
        }

        private string ObterLetrasRFC(string primeiroNome, string segundoNome, string terceiroNome)
        {
            string letras;
            string[] vogais = new string[] { "A", "E", "I", "O", "U" };
            string vogal = string.Empty;

            if (terceiroNome.Length == 0)
            {
                letras = segundoNome.Substring(0, 2) + primeiroNome.Substring(0, 2);
            }

            else if (segundoNome.Length < 3)
            {
                letras = segundoNome.Substring(0, 1) + terceiroNome.Substring(0, 1) + primeiroNome.Substring(0, 2);
            }

            else
            {
                bool eVogal = false;

                for (int i = 1; i <= segundoNome.Length - 1; i++)
                {
                    for (int x = 0; x < vogais.Length; x++)
                    {
                        if (segundoNome.Substring(i, 1) == vogais[x])
                        {
                            vogal = segundoNome.Substring(i, 1);
                            eVogal = true;
                        }
                    }

                    if (eVogal)
                    {
                        break;
                    }
                }
                letras = segundoNome[0] + vogal + terceiroNome[0] + primeiroNome[0];
            }
            return letras;
        }

        private string RemovePalavrasNaoAceitas(string palavra)
        {
            string[] palavrasNaoAceitas = new string[] { "BUEI","BUEY","CACA","CACO","CAGA","CAGO","CAKA","COGE","COJA",
                                                         "COJE","COJI","COJO","CULO","FETO","GUEY","JOTO","KACA","KACO",
                                                         "KAGA","KAGO","KOGE","KOJO","KAKA","KULO","MAME","MAMO","MEAR",
                                                         "MEON","MION","MOCO","MULA","PEDA","PEDO","PENE","PUTA","PUTO",
                                                         "QULO","RATA","RUIN"};

            foreach (var item in palavrasNaoAceitas)
            {
                palavra = palavra == item ? palavra.Substring(0, 3) + "X" : palavra;
            }
            return palavra;
        }
    }
}
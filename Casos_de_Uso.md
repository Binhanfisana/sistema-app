**CASOS DE USO**

  **1.Cadastro de Questões**  //CAURYA
  
        ◦ **Ator Principal*: Professor 
        ◦ **Pré-condições*: O professor deve estar autenticado no sistema. 
        
        ◦ **Fluxo Principal**: 
            1. O professor acessa a página de cadastro de questões. 
            2. O professor preenche os campos obrigatórios (assunto, dificuldade, tipo, conteúdo). 
            3. O professor salva a questão. 
            4. O sistema armazena a questão no banco de dados e exibe uma mensagem de sucesso. 
            
            ◦ **Fluxo Alternativo**: 
            1. Se algum campo obrigatório não for preenchido, o sistema exibe uma mensagem de erro e solicita a correção. 

   **2.Busca e Filtragem de Questões**     //BINHANFISANA
   
           ◦**Ator Principal*: Professor
           ◦**Pré-condições*: O professor deve estar autenticado no sistema. 
                 
     ◦**Fluxo Principal**: 
            1. O professor acessa a página de busca de questões. 
            2. O professor seleciona os filtros desejados (assunto, dificuldade, tipo).
            
      ◦**Fluxo Alternativo**: 
            1. Se nenhum filtro for aplicado, o sistema vai exibir todas as questões cadastradas.
            
   **Geração De Provas**    //Edney
   
    ◦ **Pré-condições*: O professor deve estar autenticado no sistema. 
                   
    ◦**Fluxo Principal**: 
            1. O professor acessa a página de geração de provas. 
            2. O professor seleciona as questões desejadas para a prova. 
            3. O professor define o título e as instruções da prova. 
            4. O professor gera a prova. 
            5. O sistema cria a prova e oferece a opção de exportação em formato PDF. 
            
    ◦**Fluxo Alternativo**: 
            1. Se o professor não selecionar nenhuma questão, o sistema exibe uma mensagem de erro e solicita a seleção de pelo menos uma questão. 
            3. O professor inicia a busca. 
            4. O sistema exibe a lista de questões que correspondem aos filtros aplicados. 
            
      ◦ **Fluxo Alternativo**: 
            1. Se nenhum filtro for aplicado, o sistema exibe todas as questões cadastradas. 
   

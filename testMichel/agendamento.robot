*** Settings ***
Library    SeleniumLibrary

Suite Setup       Dado que o usuário acessa a tela de agenda
Suite Teardown    E fecha o navegador

*** Variables ***
${URL}                 http://localhost:5173/agenda
${BROWSER}             chrome

${INPUT_TITULO}        id=title
${INPUT_INICIO}        id=startTime
${INPUT_TERMINO}       id=endTime
${BOTAO_AGENDAR}       id=btnAgendar
${MENSAGEM}            id=mensagemErroModal

*** Test Cases ***
CT01 - Deve realizar agendamento com sucesso
    Dado que o usuário informa o título    Consulta de Rotina
    E informa o início    15/10/2026 14:00
    E informa o término    15/10/2026 15:00
    Quando solicitar o agendamento
    Então o sistema deve apresentar a mensagem    Agendamento criado com sucesso.

CT02 - Deve validar título obrigatório
    Dado que o usuário informa o título    
    E informa o início    15/10/2026 14:00
    E informa o término    15/10/2026 15:00
    Quando solicitar o agendamento
    Então o sistema deve apresentar a mensagem    O campo título é obrigatório.

CT03 - Deve validar horário de término anterior ao início
    Dado que o usuário informa o título    Fisioterapia
    E informa o início    15/10/2026 15:00
    E informa o término    15/10/2026 14:00
    Quando solicitar o agendamento
    Então o sistema deve apresentar a mensagem    O horário de término deve ser posterior ao horário de início.

CT04 - Deve validar conflito de horário
    Dado que o usuário informa o título    Consulta Conflitante
    E informa o início    15/10/2026 14:30
    E informa o término    15/10/2026 15:30
    Quando solicitar o agendamento
    Então o sistema deve apresentar a mensagem    Já existe um compromisso agendado para este horário.

*** Keywords ***
Dado que o usuário acessa a tela de agenda
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window

Dado que o usuário informa o título
    [Arguments]    ${titulo}=${EMPTY}
    Input Text    ${INPUT_TITULO}    ${titulo}

E informa o início
    [Arguments]    ${inicio}=${EMPTY}
    Input Text    ${INPUT_INICIO}    ${inicio}

E informa o término
    [Arguments]    ${termino}=${EMPTY}
    Input Text    ${INPUT_TERMINO}    ${termino}

Quando solicitar o agendamento
    Click Button    ${BOTAO_AGENDAR}

Então o sistema deve apresentar a mensagem
    [Arguments]    ${mensagem}
    Element Text Should Be    ${MENSAGEM}    ${mensagem}

E fecha o navegador
    Close Browser

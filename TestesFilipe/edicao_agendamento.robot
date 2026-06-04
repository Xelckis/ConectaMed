*** Settings ***
Library    SeleniumLibrary

Suite Setup       Dado que o usuário acessa o modal de edição de agendamento
Suite Teardown    E fecha o navegador

*** Variables ***
${URL}                 http://localhost:5173/agenda
${BROWSER}             chrome

${INPUT_TITULO}        id=titleEdit
${INPUT_INICIO}        id=startTimeEdit
${INPUT_TERMINO}       id=endTimeEdit
${BOTAO_SALVAR}        id=btnSalvarEdicao
${MENSAGEM}            id=mensagemErroEdicao

*** Test Cases ***
CT01 - Deve editar agendamento com sucesso
    Dado que o usuário altera o início para    20/11/2026 14:00
    E altera o término para    20/11/2026 15:00
    Quando solicitar a gravação da edição
    Então o sistema deve apresentar a mensagem    Agendamento atualizado com sucesso.

CT02 - Deve validar acesso negado
    Dado que o usuário altera o início para    20/11/2026 14:00
    E altera o término para    20/11/2026 15:00
    Quando solicitar a gravação da edição
    Então o sistema deve apresentar a mensagem    Você não tem permissão para modificar este evento.

CT03 - Deve validar horário de término anterior ao início
    Dado que o usuário altera o início para    20/11/2026 10:00
    E altera o término para    20/11/2026 09:00
    Quando solicitar a gravação da edição
    Então o sistema deve apresentar a mensagem    O horário de término deve ser posterior ao horário de início.

CT04 - Deve validar conflito de horário na edição
    Dado que o usuário altera o início para    20/11/2026 16:00
    E altera o término para    20/11/2026 17:00
    Quando solicitar a gravação da edição
    Então o sistema deve apresentar a mensagem    Já existe um compromisso agendado para este horário.

*** Keywords ***
Dado que o usuário acessa o modal de edição de agendamento
    Open Browser    ${URL}    ${BROWSER}
    Maximize Browser Window
    # Assumindo que num teste real haveria um passo aqui para clicar no botão "Editar" de um evento

Dado que o usuário altera o início para
    [Arguments]    ${inicio}=${EMPTY}
    Input Text    ${INPUT_INICIO}    ${inicio}

E altera o término para
    [Arguments]    ${termino}=${EMPTY}
    Input Text    ${INPUT_TERMINO}    ${termino}

Quando solicitar a gravação da edição
    Click Button    ${BOTAO_SALVAR}

Então o sistema deve apresentar a mensagem
    [Arguments]    ${mensagem}
    Element Text Should Be    ${MENSAGEM}    ${mensagem}

E fecha o navegador
    Close Browser

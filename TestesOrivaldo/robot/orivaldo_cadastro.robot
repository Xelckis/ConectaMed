*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir navegador
Suite Teardown    Fechar navegador
Test Setup        Acessar tela de cadastro

*** Variables ***
${URL_CADASTRO}           http://localhost:5173/signup
${BROWSER}                edge
${INPUT_NOME}             xpath=//input[@placeholder='Maria Silva']
${INPUT_EMAIL}            xpath=//input[@placeholder='seu@email.com']
${INPUT_SENHA}            xpath=(//input[@type='password'])[1]
${INPUT_CONFIRMAR}        xpath=(//input[@type='password'])[2]
${BOTAO_CRIAR_CONTA}      xpath=//button[normalize-space()='Criar conta']

*** Test Cases ***
CT-UI-ORIVALDO-03 - Deve exibir erro no cadastro com campos vazios
    Quando solicitar cadastro
    Entao deve apresentar a mensagem    Por favor, preencha todos os campos

CT-UI-ORIVALDO-04 - Deve exibir erro quando senha nao atende aos requisitos
    Informar dados de cadastro    Orivaldo Cruvinel    orivaldo.teste@example.com    abc123    abc123
    Quando solicitar cadastro
    Entao deve apresentar a mensagem    A senha não atende aos requisitos mínimos

CT-UI-ORIVALDO-05 - Deve exibir erro quando confirmacao de senha diverge
    Informar dados de cadastro    Orivaldo Cruvinel    orivaldo.teste@example.com    Senha123    Senha321
    Quando solicitar cadastro
    Entao deve apresentar a mensagem    As senhas não coincidem

*** Keywords ***
Abrir navegador
    Open Browser    about:blank    ${BROWSER}
    Maximize Browser Window

Acessar tela de cadastro
    Go To    ${URL_CADASTRO}
    Wait Until Page Contains    Criar sua conta    timeout=10s

Informar dados de cadastro
    [Arguments]    ${nome}    ${email}    ${senha}    ${confirmacao}
    Input Text        ${INPUT_NOME}         ${nome}
    Input Text        ${INPUT_EMAIL}        ${email}
    Input Password    ${INPUT_SENHA}        ${senha}
    Input Password    ${INPUT_CONFIRMAR}    ${confirmacao}

Quando solicitar cadastro
    Click Element    ${BOTAO_CRIAR_CONTA}

Entao deve apresentar a mensagem
    [Arguments]    ${mensagem}
    Wait Until Page Contains    ${mensagem}    timeout=10s

Fechar navegador
    Close Browser

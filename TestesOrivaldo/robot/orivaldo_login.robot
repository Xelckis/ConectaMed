*** Settings ***
Library    SeleniumLibrary

Suite Setup       Abrir navegador
Suite Teardown    Fechar navegador
Test Setup        Acessar tela de login

*** Variables ***
${URL_LOGIN}              http://localhost:5173/login
${BROWSER}                edge
${INPUT_EMAIL}            xpath=//input[@type='email']
${INPUT_SENHA}            xpath=//input[@type='password']
${BOTAO_ENTRAR}           xpath=//button[normalize-space()='Entrar']
${LINK_CRIAR_CONTA}       xpath=//a[normalize-space()='Criar conta']

*** Test Cases ***
CT-UI-ORIVALDO-01 - Deve exibir erro ao tentar login com campos vazios
    Quando solicitar login
    Entao deve apresentar a mensagem    Por favor, preencha todos os campos

CT-UI-ORIVALDO-02 - Deve navegar para cadastro pela tela de login
    Click Element    ${LINK_CRIAR_CONTA}
    Wait Until Location Contains    /signup    timeout=10s
    Page Should Contain    Criar sua conta

*** Keywords ***
Abrir navegador
    Open Browser    about:blank    ${BROWSER}
    Maximize Browser Window

Acessar tela de login
    Go To    ${URL_LOGIN}
    Wait Until Page Contains    Entrar na sua conta    timeout=10s

Quando solicitar login
    Click Element    ${BOTAO_ENTRAR}

Entao deve apresentar a mensagem
    [Arguments]    ${mensagem}
    Wait Until Page Contains    ${mensagem}    timeout=10s

Fechar navegador
    Close Browser

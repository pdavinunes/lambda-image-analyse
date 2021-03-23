# Lambda Image Analyse

Uma simples lambda que utiliza AWS Rekogition para analisar imagens e traduzir para Português os resultados, utilizando Serverless Framework.

## Pré-requisitos

```sh
npm i -g serverless
aws configure \\ utilzar accessKey e secret fornecidos ao criar usuário.
```

## Executando 

Faça o deploy com:  

```sh
sls deploy 
```

Executando no Browser:

Pegue a url fornecida no momento do deploy em "endpoints -> GET". 
Cole a url no navegador da seguinte forma:

`https://<url do deploy>?imagleUrl=<imagem que deseja analisar>`

Executando via CLI:

> ### Nota
> Para executar usando os comandos abaixo, é necessário preencher a url da imagem no arquivo `request.json`

Use `local` para executar localmente. 

```sh
sls invoke local -f img-analysis --path request.json
```
```sh
sls invoke -f img-analysis --path request.json
```

## Exemplo 

Imagem fornecida

![filhote](https://www.nit.pt/wp-content/uploads/2020/07/6c5625648bd4ffce654e1c886e0a0376.jpg)

Resultado da lambda 

![alt text](https://github.com/pdavinunes/lambda-image-analyse/blob/main/images/resultado.png)

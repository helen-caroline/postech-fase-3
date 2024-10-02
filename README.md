# Tech Challenge - Fase 03

## Repositórios Públicos

1. **Repositório Lambda**:

2. **Repositório Infraestrutura Kubernetes**:

3. **Repositório Banco de Dados**:

4. **Repositório Aplicação**:
https://github.com/helen-caroline/postech-fase-3.git

## Vídeo Explicativo

## Documentação da Infraestrutura

### Banco de Dados

Escolhemos o PostgreSQL no AWS RDS devido à sua robustez, escalabilidade e suporte a transações complexas. Abaixo está a configuração do banco de dados utilizando Terraform:

```hcl
provider "aws" {
  region = "us-east-1"
}

resource "aws_db_instance" "default" {
  allocated_storage    = 20
  engine               = "postgres"
  engine_version       = "12.4"
  instance_class       = "db.t2.micro"
  name                 = "mydb"
  username             = "admin"
  password             = "password"
  parameter_group_name = "default.postgres12"
  skip_final_snapshot  = true
}

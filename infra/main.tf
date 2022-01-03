provider "aws" {
  version = "~> 3.3"
  region = "ap-south-1"
}

module "vpc_modules" {
  source = "./modules/vpc"
}
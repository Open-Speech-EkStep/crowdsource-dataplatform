terraform {
  required_version = ">= 0.12.0"
}

provider "aws" {
  version = ">= 3.3.0"
  region  = var.k8s_cluster.region
}

provider "random" {
  version = ">= 2.1"
}

provider "local" {
  version = ">= 1.4"
}

provider "null" {
  version = ">= 2.1"
}

provider "template" {
  version = ">= 2.1"
}

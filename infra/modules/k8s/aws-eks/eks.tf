module "eks-cluster" {
  source          = "terraform-aws-modules/eks/aws"
  cluster_name    = var.k8s_cluster.cluster_name
  cluster_version = var.k8s_cluster.k8s_version
  subnets         = length(module.vpc.private_subnets) == 0 ? module.vpc.public_subnets : module.vpc.private_subnets
  vpc_id          = module.vpc.vpc_id
  enable_irsa     = true

  worker_groups   = local.worker_groups
  kubeconfig_name = var.k8s_cluster.cluster_name
  worker_additional_security_group_ids = local.worker_additional_security_group_ids
}

data "aws_eks_cluster" "cluster" {
  name = module.eks-cluster.cluster_id
}

data "aws_eks_cluster_auth" "cluster" {
  name = module.eks-cluster.cluster_id
}

provider "kubernetes" {
  host                   = data.aws_eks_cluster.cluster.endpoint
  cluster_ca_certificate = base64decode(data.aws_eks_cluster.cluster.certificate_authority.0.data)
  token                  = data.aws_eks_cluster_auth.cluster.token
  load_config_file       = false
  version                = "~> 1.13"
}


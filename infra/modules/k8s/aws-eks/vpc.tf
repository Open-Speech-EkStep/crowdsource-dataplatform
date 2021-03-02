# List of AWS Availability Zones which can be accessed by an AWS account within the region configured in the provider
data "aws_availability_zones" "available" {
}

# Reference: https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest
module "vpc" {
  source  = "terraform-aws-modules/vpc/aws"
  version = "2.64.0"

  name = var.k8s_cluster.cluster_name
  cidr = var.k8s_cluster.vpc_cidr

  # Max No. of allowed availability zones is 3, since we mentioned only 3 subnets
  # https://registry.terraform.io/modules/terraform-aws-modules/vpc/aws/latest#one-nat-gateway-per-availability-zone
  azs             = length(data.aws_availability_zones.available.names) > 3 ? slice(data.aws_availability_zones.available.names, 0, 3) : data.aws_availability_zones.available.names
  private_subnets = var.k8s_cluster.private_subnets
  public_subnets  = var.k8s_cluster.public_subnets

  enable_nat_gateway     = length(module.vpc.private_subnets) != 0
  single_nat_gateway     = false
  one_nat_gateway_per_az = length(module.vpc.private_subnets) != 0
  enable_dns_hostnames   = true

  public_subnet_tags = {
    "kubernetes.io/cluster/${var.k8s_cluster.cluster_name}" = "shared"
    "kubernetes.io/role/elb"                                = "1"
  }

  private_subnet_tags = {
    "kubernetes.io/cluster/${var.k8s_cluster.cluster_name}" = "shared"
    "kubernetes.io/role/internal-elb"                       = "1"
  }

  tags = {
    Project     = var.k8s_cluster.project
    Environment = var.k8s_cluster.environment
    Cluster     = var.k8s_cluster.cluster_name
  }

  vpc_tags = {
    Name = var.k8s_cluster.cluster_name
  }

  vpn_gateway_az = data.aws_availability_zones.available.names[0]

  # default_security_group_egress = []
  # default_security_group_ingress = []
}

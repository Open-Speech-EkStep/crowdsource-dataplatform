variable "k8s_cluster" {
  type = object({
    region          = string
    vpc_cidr        = string
    private_subnets = list(string)
    public_subnets  = list(string)

    project      = string
    environment  = string
    cluster_name = string
    k8s_version  = string

  })

  default = {
    region   = "ap-south-1"
    vpc_cidr = "10.0.0.0/16"

    private_subnets = [
      "10.0.1.0/24",
      "10.0.2.0/24",
      "10.0.3.0/24",
    ]

    public_subnets = [
      "10.0.4.0/24",
      "10.0.5.0/24",
      "10.0.6.0/24",
    ]

    project      = "vakyansh"
    environment  = "test"
    cluster_name = "vakyansh"
    k8s_version  = "1.18"
  }
}

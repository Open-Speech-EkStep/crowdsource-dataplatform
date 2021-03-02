variable "worker_groups" {
  type = list(object({
    instance_type        = string
    asg_desired_capacity = number
    asg_max_size         = number
    key_name             = string
    root_volume_type     = string
    tags = list(object({
      key                 = string
      propagate_at_launch = bool
      value               = string
    }))
  }))

  default = [
    {
      instance_type        = "t2.medium"
      asg_desired_capacity = 0
      asg_max_size         = 6
      key_name             = ""
      root_volume_type     = "gp2"
      tags = [
        {
          key                 = "project"
          propagate_at_launch = "false"
          value               = "vakyansh"
        }
      ]
    }
  ]
}

variable "bastion" {
  type = object({
    enable =  bool
    trusted_cidrs = list(string)
    key_name = string
    instance_type = string
  })

  default = {
    enable = true
    trusted_cidrs = ["0.0.0.0/0"]
    key_name = ""
    instance_type = "t2.micro"
  }
}

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
    cluster_name = "infra-vakyansh-systems"
    k8s_version  = "1.18"
  }
}

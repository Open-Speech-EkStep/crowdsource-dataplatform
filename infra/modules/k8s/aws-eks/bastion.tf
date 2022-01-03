resource "aws_security_group" "bastion" {
  count = var.bastion.enable ? 1 : 0
  name = "${var.k8s_cluster.cluster_name}-bastion-security-group"
  description = "Enable SSH access to the bastion host from external via SSH port"
  vpc_id = module.vpc.vpc_id

  ingress {
    protocol = "TCP"
    from_port = 22
    to_port = 22
    cidr_blocks = var.bastion.trusted_cidrs
  }

  egress {
    from_port = 0
    protocol = "-1"
    to_port = 0
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "private-instances" {
  description = "Enable SSH access to the Private instances from the bastion via SSH port"
  name = "${var.k8s_cluster.cluster_name}-workers-security-group"
  vpc_id = module.vpc.vpc_id

  ingress {
    from_port = 22
    protocol = "TCP"
    to_port = 22
    security_groups = [aws_security_group.bastion[0].id]
  }
}

data "aws_ami" "amazon_linux" {
  most_recent = true
  owners = ["amazon"]

  filter {
    name = "name"
    values = ["amzn2-ami-hvm-*-x86_64-gp2"]
  }
}

resource "aws_launch_template" "bastion" {
  depends_on = [aws_security_group.bastion[0]]
  name_prefix = "${var.k8s_cluster.cluster_name}-bastion-"
  image_id = data.aws_ami.amazon_linux.id
  instance_type = var.bastion.instance_type
  key_name = var.bastion.key_name

  network_interfaces {
    associate_public_ip_address = true
    delete_on_termination = true
    security_groups = [aws_security_group.bastion[0].id]
  }

  monitoring {
    enabled = true
  }

  tag_specifications {
    resource_type = "instance"

    tags = {
      Name = "${var.k8s_cluster.cluster_name}-bastion"
    }
  }

  lifecycle {
    create_before_destroy = true
  }
}

resource "aws_autoscaling_group" "bastion" {
  name_prefix = "${var.k8s_cluster.cluster_name}-bastion-"
  desired_capacity = 1
  max_size = 3
  min_size = 1
  vpc_zone_identifier = module.vpc.public_subnets
  force_delete = true

  launch_template {
    id = aws_launch_template.bastion.id
    version = "$Latest"
  }

  lifecycle {
    create_before_destroy = true
  }
}

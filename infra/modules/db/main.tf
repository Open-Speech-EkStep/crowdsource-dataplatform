resource "aws_db_instance" "default" {
  allocated_storage    = 10
  engine               = "postgresql"
  engine_version       = "12.5"
  instance_class       = "db.t3.micro"
  name                 = "mydb"
  username             = "foo"
  password             = "foobarbaz"
}
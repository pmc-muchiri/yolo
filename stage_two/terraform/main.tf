terraform {
  required_providers {
    null = {
      source  = "hashicorp/null"
      version = "~> 3.0"
    }
  }
}

provider "null" {}

resource "null_resource" "bring_up_vagrant" {
  provisioner "local-exec" {
    command = "cd ../.. && vagrant up"
    interpreter = ["bash", "-c"]
  }
}

resource "null_resource" "run_ansible" {
  depends_on = [null_resource.bring_up_vagrant]

  provisioner "local-exec" {
    command = "ansible-playbook ../ansible/playbook.yml -i ../ansible/inventory.ini"
    interpreter = ["bash", "-c"]
  }
}

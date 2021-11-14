Image Ubuntu Server onto disk

Start RPI, login as "Ubuntu", pass "Ubuntu"

## Miscellaneous
```
sudo timedatectl set-timezone EST
sudo apt update
sudo apt upgrade
```

## Connect to wifi
```
sudoedit /etc/netplan/50-cloud-init.yaml
```
```
network:
    ethernets:
        eth0:
            match:
              driver: bcmgenet
            dhcp4: true
            optional: true
    version: 2
    wifis:
        wlp3s0:
            optional: true
            access-points:
                "SSID-NAME":
                    password: "PASSWORD"
            dhcp4: true
```
```
sudo netplan apply
ip a
```
Add LAN IP to the hosts file

<br />

## SSH
```
sudo apt install openssh-server
sudo systemctl status ssh
```
Add public rsa key
```
scp ~/.ssh/id_rsa.pub ubuntu@nastberry:~/.ssh/
cat id_rsa.pub >> ~/.ssh/authorized_keys
```

## Python
```
cd /usr/bin
sudo ln -s python3 python
sudo apt install i2c-tools python3-smbus pipenv
sudo i2cdetect -y 1
```
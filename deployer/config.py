from pathlib import Path

# TODO: Change to False and make it configurable
DRY_RUN = False
LIBVIRT_BASE_PATH = Path('/var/lib/libvirt')
LIBVIRT_IMAGES = LIBVIRT_BASE_PATH.joinpath('images')
LIBVIRT_TEMPLATES = LIBVIRT_IMAGES.joinpath('templates')
UBUNTU_TEMPLATE = LIBVIRT_TEMPLATES.joinpath('ubuntu-22.04-server.qcow2')

import logging
import shlex
import subprocess
import sys
import argparse

from .config import DRY_RUN

def ProcessArguments() -> str:
    parser = argparse.ArgumentParser(description="Parse topology config")
    parser.add_argument("-c", "--config", required=True)
    parser.add_argument("-l", "--log", type=str, choices=["DEBUG", "INFO",
                                                          "WARNING", "ERROR",
                                                          "CRITICAL"])
    parser.add_argument("--dry-run", action="store_true")
    args = parser.parse_args()

    if args.log:
        log_level = getattr(logging, args.log.upper(), None)
        if not isinstance(log_level, int):
            raise ValueError("Invalid log level: {}".format(args.log))
        logging.basicConfig(level=log_level)

    if args.dry_run:
        DRY_RUN = args.dry_run

    return args.config

def ExecuteCommand(cmd: str) -> None:
    if not DRY_RUN:
        logging.info("Executing command : {}".format(cmd))
        ret = subprocess.call(shlex.split(cmd))
        if ret != 0:
            logging.error("Command {} failed wih return code : {}".format(cmd, ret))
            sys.exit(ret)
    else:
        logging.info("Dry Run enabled. Command : {}".format(cmd))

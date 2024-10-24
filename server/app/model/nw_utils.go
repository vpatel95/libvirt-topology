package model

import (
    "errors"
    "net"

    valid "github.com/asaskevich/govalidator"
)

func isNetworkType(nt NetworkType) bool {
    for _, TYPE := range NetworkTypeList {
        if (nt == TYPE) {
            return true
        }
    }

    return false
}

func validateNetwork(nw Network) error {
    if (valid.IsNull(nw.Name) || !valid.IsCIDR(nw.Subnet4) ||
            !isNetworkType(nw.Type) || (nw.TopologyID <= 0) || (nw.UserID <= 0)) {
        return errors.New("Invalid request parameters")
    }

    if (nw.HasV6) {
        if (!valid.IsCIDR(nw.Subnet6)) {
            return errors.New("Invalid request parameters")
        }
    }

    return nil
}

func getPrefixLen(ipNet *net.IPNet) int {
    ones, _ := ipNet.Mask.Size()

    return ones
}

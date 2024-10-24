package model

import (
	"net"

	"github.com/vpatel95/topology-deployer/database"
	"gorm.io/gorm"
)

const (
    NAT NetworkType = "nat"
    Isolated NetworkType = "isolated"
    Management NetworkType = "management"
)

var (
    NetworkTypeList = []NetworkType{NAT, Isolated, Management}
)

type (
    NetworkType string
    Network struct {
        gorm.Model
        Name            string `gorm:"column:name;unique_index;not null" json:"name"`
        Subnet4         string `gorm:"column:subnet4;not null" json:"subnet4"`
        PrefixLen4      int `gorm:"column:prefix_len4" json:"prefix_len4"`
        AddrV4          string `gorm:"column:addr_v4" json:"addr_v4"`
        HasV6           bool `gorm:"column:has_v6;not null" json:"has_v6"`
        Subnet6         string `gorm:"column:subnet6" json:"subnet6"`
        PrefixLen6      int `gorm:"column:prefix_len6" json:"prefix_len6"`
        AddrV6          string `gorm:"column:addr_v6" json:"addr_v6"`
        Type            NetworkType `gorm:"type:enum('nat', 'isolated', 'management');not null"`
        TopologyID      int `gorm:"column:topology_id;not null" json:"topology_id"`
        UserID          int `gorm:"column:user_id;not null" json:"user_id"`
    }
)

func (n *Network) Serialize() JSON {
    var nw JSON

    nw = JSON{
        "id":               n.ID,
        "name":             n.Name,
        "subnet4":          n.Subnet4,
        "prefix_len4":      n.PrefixLen4,
        "addr_v4":          n.AddrV4,
        "type":             n.Type,
        "topology_id":      n.TopologyID,
        "user_id":          n.UserID,
    }

    if (n.HasV6) {
        nw["has_v6"]        = true
        nw["subnet6"]       = n.Subnet6
        nw["prefix_len6"]   = n.PrefixLen6
        nw["addr_v6"]       = n.AddrV6
    }

    return nw
}

func (n *Network) Load(data JSON) {
    n.ID = uint(data["id"].(float64))
    n.Name = data["name"].(string)
    n.Subnet4 = data["subnet4"].(string)
    n.PrefixLen4 = data["prefix_len4"].(int)
    n.AddrV4 = data["addr_v4"].(string)
    n.Type = data["network_type_id"].(NetworkType)
    n.TopologyID = data["topology_id"].(int)
    n.UserID = data["user_id"].(int)

    if (data["has_v6"].(bool)) {
        n.HasV6 = true
        n.Subnet6 = data["subnet6"].(string)
        n.PrefixLen6 = data["prefix_len6"].(int)
        n.AddrV6 = data["addr_v6"].(string)
    }
}

func (nw *Network) GetV4Addr() (string, error) {
    return "", nil
}

func (nw *Network) GetV6Addr() (string, error) {
    return "", nil
}

func MigrateNetwork(db *gorm.DB) *gorm.DB {
    db.AutoMigrate(&Network{})
    return db
}

func CreateNetwork(nw Network) error {
    var err error
    if err = validateNetwork(nw); err != nil {
        return err
    }

    ip, ipNet, err := net.ParseCIDR(nw.Subnet4)
    if err != nil {
        return err
    }
    nw.PrefixLen4 = getPrefixLen(ipNet)
    nw.AddrV4 = ip.String()

    if (nw.HasV6) {
        ip6, ip6Net, err := net.ParseCIDR(nw.Subnet6)
        if err != nil {
            return err
        }
        nw.PrefixLen6 = getPrefixLen(ip6Net)
        nw.AddrV6 = ip6.String()
    }

    db := database.DB
    return db.Create(&nw).Error
}

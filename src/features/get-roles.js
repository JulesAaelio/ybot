const util = require('util');

module.exports = async (bot, app, db) => {
    app.get('/:guildId/members',async (req, res) => {
        const guildId = req.params.guildId;
       if(!guildId) {
           res.status(400).send('Missing parameter : guildId');
           return;
       }
       const guild = bot.guilds.get(guildId);

       const trombis = await db.Trombi.findAll({
           where: {
               guildId: guildId
           }
       });

       let rawMembers;
       if(req.query && req.query.roles) {
           rawMembers = guild.members.filter((member) => {
               let roles;
               if(!Array.isArray(req.query.roles)) {
                   roles = [req.query.roles]
               } else {
                   roles = req.query.roles;
               }
               for (let i = 0; i < roles.length; i++) {
                   if(member.roles.get(roles[i])) {
                       return true;
                   }
               }
               return false;
           })
       } else {
           rawMembers = guild.members;
       }

       const members = formatMembers(rawMembers);
        for (let i = 0; i < trombis.length; i++) {
            if(members[trombis[i].userId]) {
                members[trombis[i].userId].trombi = trombis[i];
            }
        }
      res.json(members);
    });

    app.get('/:guildId/roles',async (req, res) => {
        const guildId = req.params.guildId;

        if(!guildId) {
            res.status(400).send('Missing parameter : guildId');
            return;
        }
        const guild = bot.guilds.get(guildId);
        const roles = formatRoles(guild.roles);
        res.json(roles);

    });
};

formatMembers = (members) => {
    members = members.array();

    const formattedMembers = members.reduce(function(map, member) {
        map[member.id] = {
            id: member.id,
            nickname: member.nickname,
            roles: formatRoles(member.roles)
        };
        return map;
    }, {});

    return formattedMembers;

};

const formatRoles = (roles) => {
    roles = roles.array();
    const formattedRoles =  roles.reduce(function(map, role) {
        map[role.id] = {
            id: role.id,
            name : role.name,
            color: role.color,
        };
        return map;
    }, {});
    return formattedRoles;
};

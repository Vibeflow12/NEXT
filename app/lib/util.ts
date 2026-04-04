import { Team, User } from '@/app/types/types'

export function transformUser(user: any): User {
    return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        teamId: user.teamId || undefined,
        team: user.team || undefined,
        createdAt: new Date(user.createdAt),
        updatedAt: new Date(user.updatedAt),
    };
}

export function transformUsers(users: any[]): User[] {
    return (users || []).map(transformUser)
}

export function transformTeam(team: any): Team {
    return {
        id: team.id,
        name: team.name,
        description: team.description,
        code: team.code,
        members: team.members || [],
        createdAt: new Date(team.createdAt),
        updatedAt: new Date(team.updatedAt)
    };
}

export function transformTeams(teams: any[]): Team[] {
    return (teams || []).map(transformTeam)
}
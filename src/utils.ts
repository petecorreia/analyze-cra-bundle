import Command from '@oclif/command'
import { ReposCreateStatusParams } from '@octokit/rest'
const { octokit } = require('@octokit/rest')()

type EventType = 'push' | 'pull_request' | 'api' | 'cron'

type Env = {
	TRAVIS_EVENT_TYPE: EventType
	TRAVIS_REPO_SLUG: string
	TRAVIS_JOB_WEB_URL: string
	ANALYZE_CRA_GITHUB_TOKEN: string
}

export async function setStatus({
	context,
	description,
	env,
	command,
}: {
	context: string
	description: string
	env: Env
	command: Command
}) {
	const { TRAVIS_EVENT_TYPE, TRAVIS_REPO_SLUG, TRAVIS_JOB_WEB_URL, ANALYZE_CRA_GITHUB_TOKEN } = env

	const sha = getCommitSha(TRAVIS_EVENT_TYPE, command)

	if (!sha) return

	const repoSlug = TRAVIS_REPO_SLUG
	const parsedSlug = repoSlug.split('/')
	const owner = parsedSlug[0]
	const repo = parsedSlug[1]

	const params: ReposCreateStatusParams = {
		owner,
		repo,
		sha,
		state: 'success',
		target_url: TRAVIS_JOB_WEB_URL,
		description,
		context,
	}

	octokit.authenticate({
		type: 'oauth',
		token: ANALYZE_CRA_GITHUB_TOKEN,
	})

	await octokit.repos.createStatus(params)
}

function getCommitSha(eventType: EventType, command: Command) {
	if (eventType === 'push') {
		return process.env.TRAVIS_COMMIT
	} else if (eventType === 'pull_request') {
		const travisCommitRange = process.env.TRAVIS_COMMIT_RANGE
		if (!travisCommitRange) {
			command.error('TRAVIS_COMMIT_RANGE not found')
			return
		}
		const parsed = travisCommitRange.split('...')
		return parsed.length === 1 ? travisCommitRange : parsed[1]
	}

	command.error(`event type '${eventType}' not supported`)
	return
}

export function formatBytes(bytes: number, decimals = 2): string {
	if (bytes === 0) return '0 Bytes'
	const k = 1024
	const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB']
	const i = Math.floor(Math.log(bytes) / Math.log(k))
	return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i]
}

export function generateSpaces(howMany: number) {
	return Array.from({ length: howMany }).reduce((acc, s) => acc + ' ', '')
}

export default {
    git: {
        commitMessage: 'chore(release): 🚀 v${version}',
        requireBranch: 'main', // Stopps if your current branch not match
        tag: true,
        tagName: 'v${version}',
        tagAnnotation: 'Release v${version}',
    },
    github: {
        release: true,
        releaseName: 'v${version}',
        assets: ['build/*.tar.gz']
    },
    npm: {
        publish: false
    }
}
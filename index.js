//exec in shell
import { exec } from 'child_process';
import {promisify} from 'util'

const ex = promisify(exec);
async function Execute(command){
    let {stdout} = await ex(command);
    return stdout;
}

async function GetRepoCommits(owner_repo){
    let command = `gh api -H "Accept: application/vnd.github.v3+json" repos/${owner_repo}/commits?author=${user}`;
    let stdOut = await Execute(command)
    return JSON.parse(stdOut); 
}

console.log("Loading ...");
const user = process.argv[2];
const command = `gh repo list ${user} --visibility public`
const stdout = await Execute(command);
const repos = stdout.split('\n');
const jsonRepos = repos.filter(r => r.length).map(repo => {
    let [name,description,visibility,publicDate] =  repo.split('\t')
    return {name,description,visibility,publicDate};
});

let result = [];
let TOTAL = 0;

for(let repo of jsonRepos){
    console.log("Loading repo: " + repo.name + " ...");
    let commits = await GetRepoCommits(repo.name);
    let r = {...repo,commits:commits.length};
    result.push(r);
    TOTAL += commits.length;
}

console.log("Total commits: " + TOTAL);
console.table(result);





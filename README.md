# Squads v4 Public Client: Backup
This is an open-source interface that allows you to interact with the Squads program where your assets sit. You can fork it and host it locally to access your Squads account(s) and then, for instance, withdraw your assets. 

> [!NOTE]
> Did you expect to find `Squads' minimal UI` here? You're... kinda in the right place! We have this extra, and continously managed, UI to locally access and manage your Squads account(s) in the unlikely event that the Squads app would be unavailable for a long period.
>
> The code for the official Squads' public FE implementation can be found [here](https://github.com/Squads-Protocol/squads-v4-public-ui) and the documentation [here](https://docs.squads.so/main).
> 
### TODO:

- [x] Read existing squads
<!-- - [ ] Read existing transactions (https://v4-api.squads.so/transactionV2/${vault}) -->
- [x] Read existing transactions (https://v4-api.squads.so/transactionsPaginated/${vault}?page=1)
- [x] Read existing balances (https://v4-api.squads.so/balancesDasV2/${vaulr}?sendAll=true&cacheBypass=false&useProd=true)
- [x] Manage existing squads
- [x] Execute transactions (Vault & Config transactions)
- [x] Create new squads
- [ ] Increase threshold
- [ ] Send, receive, and trade tokens

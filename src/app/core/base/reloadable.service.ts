import { Subject } from "rxjs";

export abstract class ReloadableService {

    protected readonly reloadSubject = new Subject<void>();
    
    readonly reload$ = this.reloadSubject.asObservable();

    protected triggerReload(): void {
        this.reloadSubject.next();
    }
}  

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Subject } from 'rxjs';
import { of } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { Hero } from '../shared/hero.model';
import { HeroSearchService } from './hero-search.service';


@Component({
    // moduleId: module.id,
    selector: 'hero-search',
    templateUrl: './hero-search.component.html',
    styleUrls: ['./hero-search.component.css'],
    providers: [HeroSearchService],
})

export class HeroSearchComponent implements OnInit {
    public heroes$: Observable<Hero[]>;
    private searchTerms = new Subject<string>();

    constructor(
        private heroSearchService: HeroSearchService,
        private router: Router) { }

    ngOnInit(): void {
        this.heroes$ = this.searchTerms.pipe(
            // wait 300ms after each keystroke before considering the term
            debounceTime(300),

            // ignore new term if same as previous term
            distinctUntilChanged(),

            // switch to new search observable each time the term changes
            switchMap((term: string) => this.heroSearchService.search(term)),
            catchError((error) => {
                console.log(error);
                return of<Hero[]>([]);
            }),
        );
    }

    // Push a search term into the Observable stream
    search(term: string): void {
        this.searchTerms.next(term);
    }

    gotoDetail(hero: Hero): void {
        const link = ['/detail', hero.id];
        this.router.navigate(link);
    }
}

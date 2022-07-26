import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Recipe } from '../recipe.model';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import * as fromApp from '../../store/app.reducer'
import { map, switchMap } from 'rxjs/operators';
import * as RecipesActions from '../store/recipe.action'
import * as ShoppingListActions from 'src/app/shopping-list/store/shoppingList.action';

@Component({
  selector: 'app-recipe-details',
  templateUrl: './recipe-details.component.html',
  styleUrls: ['./recipe-details.component.css']
})
export class RecipeDetailsComponent implements OnInit {
  id: number;
  recipe: Recipe
  recipepreview: string

  constructor(private route: ActivatedRoute, private router: Router, private store: Store<fromApp.AppState>) { }

  ngOnInit() {

    this.route.params.pipe(map(params => {
      return +params['id'];

    }),

      switchMap(id => {
        this.id = id;
        return this.store.select('recipes');
      }),
      map(recipesState => {
        return recipesState.recipes.find((recipe, index) => {
          return index === this.id
        })
      })
    ).subscribe(recipe => { this.recipe = recipe })
  }


  onAddToShoppingList() {

    this.store.dispatch(new ShoppingListActions.addIngredients(this.recipe.ingredients))
  }

  onEditRecipe() {
    this.router.navigate(['edit'], { relativeTo: this.route });

  }

  onDeleteRecipe() {

    this.store.dispatch(new RecipesActions.DeleteRecipe(this.id))
    this.router.navigate(['/recipes']);
  }


}

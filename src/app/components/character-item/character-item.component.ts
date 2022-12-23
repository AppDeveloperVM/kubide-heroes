import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-character-item',
  templateUrl: './character-item.component.html',
  styleUrls: ['./character-item.component.scss']
})
export class CharacterItemComponent {
  @Input() name: Number = 1;
  @Input() added: Boolean = true;

  openHeroDetails(){
    alert('Open hero details');
  }

}

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Icon } from './icon';

describe('Icon', () => {
  let fixture: ComponentFixture<Icon>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Icon],
    }).compileComponents();

    fixture = TestBed.createComponent(Icon);
  });

  it('renders an svg for the given icon name', () => {
    fixture.componentRef.setInput('name', 'search');
    fixture.detectChanges();

    const svg: SVGSVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg).toBeTruthy();
    expect(svg.querySelectorAll('circle, line, path, polyline, polygon, rect, ellipse').length).toBeGreaterThan(0);
  });

  it('sizes the svg according to the size input', () => {
    fixture.componentRef.setInput('name', 'x');
    fixture.componentRef.setInput('size', 32);
    fixture.detectChanges();

    const svg: SVGSVGElement = fixture.nativeElement.querySelector('svg');
    expect(svg.getAttribute('width')).toBe('32');
    expect(svg.getAttribute('height')).toBe('32');
  });
});

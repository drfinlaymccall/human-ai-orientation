"""Canonical unit membership and readable, script-free syllabus rendering."""
from html import escape

BASELINE = ['first-task', 'useful-context', 'check-and-continue']


def validate_structure(course):
    activities = course['activities']
    slugs = [a['slug'] for a in activities]
    assert len(slugs) == len(set(slugs)), 'Duplicate activity'
    assert course['baseline_version'] == 1 and course['baseline_slugs'] == BASELINE
    assert [a['slug'] for a in activities if a['baseline']] == BASELINE
    members, modules, units, groups = [], [], [], []
    for unit in course['units']:
        units.append(unit['slug'])
        assert unit['status'] in ('active', 'planned')
        if unit['status'] == 'planned':
            assert 'journey_url' not in unit, 'Planned unit cannot have a journey'
        for module in unit['modules']:
            modules.append(module['slug'])
            groups.append(module.get('native_group_slug', module['slug']))
            assert module['slug'] != 'computer-use', 'Legacy subsection identity is reserved'
            if unit['status'] == 'planned':
                assert not module['activities'], 'Planned unit cannot publish activities'
            members.extend(module['activities'])
    assert len(groups) == len(set(groups)), 'Duplicate native group identity'
    assert len(units) == len(set(units)) and len(modules) == len(set(modules))
    assert sorted(members) == sorted(slugs), 'Every activity must belong to exactly one module'
    for activity in activities:
        assert activity['idnumber'] == 'orientation:' + activity['slug']
    return course


def ordered_activities(course):
    validate_structure(course)
    lookup = {a['slug']: a for a in course['activities']}
    return [lookup[s] for u in course['units'] if u['status'] == 'active'
            for m in u['modules'] for s in m['activities']]


def syllabus(course, journey=False):
    validate_structure(course)
    parts = ['<section data-unit-syllabus><h2>Unit 1 syllabus</h2>' if journey else
             '<div data-course-catalogue><h1>Course catalogue</h1><p>One course, with units you can explore at your own pace.</p>']
    for unit in course['units']:
        if journey and unit['status'] != 'active':
            continue
        heading = '' if journey else f'<h2>{escape(unit["label"])}</h2>'
        parts.append(f'<section data-unit="{escape(unit["slug"])}">{heading}<p>{escape(unit["syllabus"])}</p>')
        if unit['status'] == 'planned':
            parts.append('<p><strong>Planned — not yet available</strong></p>')
        elif not journey:
            parts.append(f'<p><a href="{escape(unit["journey_url"])}">Open Unit 1 journey</a></p>')
        parts.append('<ol>')
        for module in unit['modules']:
            label = escape(module['label'])
            if journey:
                label = f'<a href="#atlas-detail-{module["activities"][0]}">{label}</a>'
            parts.append(f'<li data-curriculum-module="{escape(module["slug"])}"><strong>{label}</strong>: {escape(module["description"])}</li>')
        parts.append('</ol></section>')
    parts.append('</section>' if journey else '</div>')
    return ''.join(parts)

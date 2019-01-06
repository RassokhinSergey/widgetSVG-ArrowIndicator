# widgetSVG-ArrowIndicator
Это больше обучающий проект. Основная цель этого стрелочного индикатора на SVG продемонстрировать простоту внедрения в основной документ и саму разработку. Этот компонент при разработки разделен функционально на несколько файлов. В случае изменения внешнего вида с помощью css или svg эти части вынесены в отдельные файлы что позволит их редактировать дизайнеру более смело. При разработки отдельных компонентов возникает несколько проблем. Первая то что мы внедряемся в готовую систему и есть большая вероятность того что наши переменные, функции, классы в JavaSscript могут повлиять на систему в которую мы внедряемся. А если мы используем стили (css) то вероятность конфликтов еще больше. Конечно эти проблемы решаемы, но если использовать svg как контейнер то этих проблем не возникнет. Все стили и скрипты никак не пересекаются с основным документом. Вторая проблема возникает при непосредственном внедрении компонента. 

Люди которые будут внедрять компонент как правило имеют более низкую квалификацию и это приводит к ошибкам. Зачастую надо добавлять несколько строк в разные части документа что приводит к куче вопросов причем связаны не с самим компонентом, а с тем как написана их система. С svg это может быть только одна строка.

Данный компонент использует как JavaScript так css кроме того он может принимать некоторые параметры. Внедрение этого компонента заключается в том что, в месте где должен он появится надо добавить вот такую строку.
```<object width="200px" height="200px" id="voltL3" data="svg/SVG-ArrowIndicator.svg" type="image/svg+xml" data-url="/handlers/getControlVolt.php"/>```
Причем ее можно еще упростить не писать id если у нас только один индикатор и не писать data-url если путь к нашему хендлеру не отличается от написанного. Размер тоже можно не указывать тогда он будет 200 х 200 если его указать то компонент масштабируемый то указанных размеров.

